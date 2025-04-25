import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Hook para gerenciamento de projetos
export default function useProjetos() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const db = getFirestore();
  const storage = getStorage();
  
  // Obter todos os projetos de um usuário
  const getProjetos = async (usuarioId) => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, 'projetos'), where('usuarioId', '==', usuarioId));
      const querySnapshot = await getDocs(q);
      
      const projetos = [];
      querySnapshot.forEach((doc) => {
        projetos.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, projetos };
    } catch (error) {
      console.error('Erro ao obter projetos:', error);
      setError('Erro ao carregar projetos. Tente novamente.');
      return { success: false, message: 'Erro ao carregar projetos.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Obter um projeto específico pelo ID
  const getProjetoPorId = async (projetoId) => {
    try {
      setLoading(true);
      setError(null);
      
      const projetoDoc = await getDoc(doc(db, 'projetos', projetoId));
      
      if (projetoDoc.exists()) {
        // Buscar análise relacionada
        const q = query(collection(db, 'analises'), where('projetoId', '==', projetoId));
        const analiseSnapshot = await getDocs(q);
        
        let analise = null;
        if (!analiseSnapshot.empty) {
          analiseSnapshot.forEach((doc) => {
            analise = {
              id: doc.id,
              ...doc.data()
            };
          });
        }
        
        return { 
          success: true, 
          projeto: {
            id: projetoDoc.id,
            ...projetoDoc.data(),
            analise
          }
        };
      } else {
        setError('Projeto não encontrado.');
        return { success: false, message: 'Projeto não encontrado.' };
      }
    } catch (error) {
      console.error('Erro ao obter projeto:', error);
      setError('Erro ao carregar projeto. Tente novamente.');
      return { success: false, message: 'Erro ao carregar projeto.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Adicionar um novo projeto
  const adicionarProjeto = async (projeto, arquivos = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Upload de arquivos para o Storage (se houver)
      const arquivosUrls = [];
      
      if (arquivos && arquivos.length > 0) {
        for (const arquivo of arquivos) {
          const storageRef = ref(storage, `projetos/${Date.now()}_${arquivo.name}`);
          await uploadBytes(storageRef, arquivo);
          const url = await getDownloadURL(storageRef);
          arquivosUrls.push(url);
        }
      }
      
      // Adicionar projeto ao Firestore
      const novoProjeto = {
        ...projeto,
        data: new Date(),
        status: 'Em Análise',
        conformidade: 'Pendente',
        arquivosUrls
      };
      
      const docRef = await addDoc(collection(db, 'projetos'), novoProjeto);
      
      // Iniciar análise automática (simulação)
      const analise = await iniciarAnalise(docRef.id, novoProjeto);
      
      return { 
        success: true, 
        projeto: {
          id: docRef.id,
          ...novoProjeto,
          analise
        }
      };
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
      setError('Erro ao adicionar projeto. Tente novamente.');
      return { success: false, message: 'Erro ao adicionar projeto.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar um projeto existente
  const atualizarProjeto = async (projetoId, dadosAtualizados, novosArquivos = []) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter projeto atual
      const projetoDoc = await getDoc(doc(db, 'projetos', projetoId));
      
      if (!projetoDoc.exists()) {
        setError('Projeto não encontrado.');
        return { success: false, message: 'Projeto não encontrado.' };
      }
      
      const projetoAtual = projetoDoc.data();
      
      // Upload de novos arquivos (se houver)
      const arquivosUrls = [...(projetoAtual.arquivosUrls || [])];
      
      if (novosArquivos && novosArquivos.length > 0) {
        for (const arquivo of novosArquivos) {
          const storageRef = ref(storage, `projetos/${Date.now()}_${arquivo.name}`);
          await uploadBytes(storageRef, arquivo);
          const url = await getDownloadURL(storageRef);
          arquivosUrls.push(url);
        }
      }
      
      // Atualizar projeto no Firestore
      const dadosParaAtualizar = {
        ...dadosAtualizados,
        arquivosUrls
      };
      
      await updateDoc(doc(db, 'projetos', projetoId), dadosParaAtualizar);
      
      // Se os dados atualizados afetam a análise, reiniciar análise
      if (dadosAtualizados.areaTerreno || dadosAtualizados.areaConstruida) {
        const projetoAtualizado = {
          ...projetoAtual,
          ...dadosAtualizados,
          arquivosUrls
        };
        
        await iniciarAnalise(projetoId, projetoAtualizado);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      setError('Erro ao atualizar projeto. Tente novamente.');
      return { success: false, message: 'Erro ao atualizar projeto.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Remover um projeto
  const removerProjeto = async (projetoId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remover análises relacionadas
      const q = query(collection(db, 'analises'), where('projetoId', '==', projetoId));
      const analiseSnapshot = await getDocs(q);
      
      const batch = db.batch();
      
      analiseSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Remover projeto
      batch.delete(doc(db, 'projetos', projetoId));
      
      await batch.commit();
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover projeto:', error);
      setError('Erro ao remover projeto. Tente novamente.');
      return { success: false, message: 'Erro ao remover projeto.' };
    } finally {
      setLoading(false);
    }
  };
  
  // Iniciar análise automática de um projeto
  const iniciarAnalise = async (projetoId, projeto) => {
    try {
      // Simulação de análise automática
      // Em uma implementação real, isso poderia ser um Cloud Function
      
      // Análise de parâmetros urbanísticos
      const recuoFrontal = {
        valor: parseFloat((Math.random() * 6 + 2).toFixed(1)), // Entre 2 e 8
        minimo: 5.0,
        conforme: false // Será calculado abaixo
      };
      recuoFrontal.conforme = recuoFrontal.valor >= recuoFrontal.minimo;
      
      const recuoLateral = {
        valor: parseFloat((Math.random() * 3 + 0.5).toFixed(1)), // Entre 0.5 e 3.5
        minimo: 1.5,
        conforme: false // Será calculado abaixo
      };
      recuoLateral.conforme = recuoLateral.valor >= recuoLateral.minimo;
      
      const taxaOcupacao = {
        valor: Math.round((projeto.areaConstruida / projeto.areaTerreno) * 100),
        maximo: 70,
        conforme: false // Será calculado abaixo
      };
      taxaOcupacao.conforme = taxaOcupacao.valor <= taxaOcupacao.maximo;
      
      const taxaPermeabilidade = {
        valor: Math.round(Math.random() * 30 + 10), // Entre 10 e 40
        minimo: 20,
        conforme: false // Será calculado abaixo
      };
      taxaPermeabilidade.conforme = taxaPermeabilidade.valor >= taxaPermeabilidade.minimo;
      
      const coeficienteAproveitamento = {
        valor: parseFloat((projeto.areaConstruida / projeto.areaTerreno).toFixed(2)),
        maximo: 1.5,
        conforme: false // Será calculado abaixo
      };
      coeficienteAproveitamento.conforme = coeficienteAproveitamento.valor <= coeficienteAproveitamento.maximo;
      
      // Análise de representação gráfica
      const representacaoGrafica = {
        plantaBaixa: Math.random() > 0.1, // 90% de chance de ser true
        cortes: Math.random() > 0.2, // 80% de chance de ser true
        fachadas: Math.random() > 0.2, // 80% de chance de ser true
        implantacao: Math.random() > 0.1, // 90% de chance de ser true
        cobertura: Math.random() > 0.3, // 70% de chance de ser true
        cotasNiveis: Math.random() > 0.3, // 70% de chance de ser true
        escalas: Math.random() > 0.2, // 80% de chance de ser true
        norte: Math.random() > 0.4 // 60% de chance de ser true
      };
      
      // Gerar observações
      const observacoes = [];
      
      if (!recuoFrontal.conforme) {
        observacoes.push('O recuo frontal está abaixo do mínimo exigido pela legislação municipal.');
      }
      
      if (!recuoLateral.conforme) {
        observacoes.push('O recuo lateral está abaixo do mínimo exigido pela legislação municipal.');
      }
      
      if (!taxaOcupacao.conforme) {
        observacoes.push('A taxa de ocupação está acima do máximo permitido pela legislação municipal.');
      }
      
      if (!taxaPermeabilidade.conforme) {
        observacoes.push('A taxa de permeabilidade está abaixo do mínimo exigido.');
      }
      
      if (!coeficienteAproveitamento.conforme) {
        observacoes.push('O coeficiente de aproveitamento está acima do máximo permitido pela legislação municipal.');
      }
      
      if (!representacaoGrafica.plantaBaixa) {
        observacoes.push('Falta planta baixa conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.cortes) {
        observacoes.push('Faltam cortes conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.fachadas) {
        observacoes.push('Faltam fachadas conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.implantacao) {
        observacoes.push('Falta implantação conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.cobertura) {
        observacoes.push('Falta planta de cobertura conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.cotasNiveis) {
        observacoes.push('Faltam cotas e níveis conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.escalas) {
        observacoes.push('Faltam escalas conforme exigido nas normas de representação.');
      }
      
      if (!representacaoGrafica.norte) {
        observacoes.push('Falta indicação do norte na implantação.');
      }
      
      // Determinar conformidade geral
      const conformidadeParametros = recuoFrontal.conforme && recuoLateral.conforme && 
                                    taxaOcupacao.conforme && taxaPermeabilidade.conforme && 
                                    coeficienteAproveitamento.conforme;
      
      const conformidadeRepresentacao = representacaoGrafica.plantaBaixa && representacaoGrafica.cortes && 
                                       representacaoGrafica.fachadas && representacaoGrafica.implantacao;
      
      const conformidade = conformidadeParametros && conformidadeRepresentacao ? 'Total' : 'Parcial';
      
      // Criar documento de análise
      const analise = {
        projetoId,
        data: new Date(),
        parametros: {
          recuoFrontal,
          recuoLateral,
          taxaOcupacao,
          taxaPermeabilidade,
          coeficienteAproveitamento
        },
        representacaoGrafica,
        observacoes,
        conformidade
      };
      
      // Salvar análise no Firestore
      const analiseRef = await addDoc(collection(db, 'analises'), analise);
      
      // Atualizar status do projeto
      await updateDoc(doc(db, 'projetos', projetoId), {
        status: 'Análise Concluída',
        conformidade
      });
      
      return {
        id: analiseRef.id,
        ...analise
      };
    } catch (error) {
      console.error('Erro ao iniciar análise:', error);
      return null;
    }
  };
  
  return {
    loading,
    error,
    getProjetos,
    getProjetoPorId,
    adicionarProjeto,
    atualizarProjeto,
    removerProjeto,
    iniciarAnalise
  };
}
