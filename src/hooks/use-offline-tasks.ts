'use client';

import { useState, useEffect } from 'react';
import { data } from '@/lib/data';

type CompletedTask = {
  id: string;
  taskType: 'revision' | 'validator';
  completedAt: string;
  status: 'Completada';
  busNumber?: string;
  formSubmissionId?: string;
};

type CompletedForm = {
  id: string;
  submittedAt: string;
  busNumber: string;
  operator: string;
  technician: string;
  formData: any;
  status: 'Completada';
};

type Task = (typeof data.revisiones[0] & { taskType: 'revision' }) | 
            (typeof data.validadors_tasks[0] & { taskType: 'validator' });

export const useOfflineTasks = () => {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [completedForms, setCompletedForms] = useState<CompletedForm[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar tareas completadas y formularios desde localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Cargar tareas completadas
      const storedTasks = localStorage.getItem('completedTasks');
      if (storedTasks) {
        try {
          setCompletedTasks(JSON.parse(storedTasks));
        } catch (error) {
          console.error('Error parsing completed tasks from localStorage:', error);
          setCompletedTasks([]);
        }
      }
      
      // Cargar formularios completados
      const storedForms = localStorage.getItem('completedMaintenanceForms');
      if (storedForms) {
        try {
          setCompletedForms(JSON.parse(storedForms));
        } catch (error) {
          console.error('Error parsing completed forms from localStorage:', error);
          setCompletedForms([]);
        }
      }
      
      setIsLoaded(true);
    }
  }, []);

  // Función para fusionar tareas base con estado offline
  const mergeTasksWithOfflineStatus = (baseTasks: Task[]): Task[] => {
    if (!isLoaded) return baseTasks;

    return baseTasks.map(task => {
      // Buscar por ID exacto
      const completedTaskById = completedTasks.find(ct => ct.id === task.id);
      if (completedTaskById) {
        return { ...task, estado: 'Completada' as const };
      }
      
      // Buscar por número de vehículo (para formularios completados)
      if (task.taskType === 'revision') {
        const completedByVehicle = completedTasks.find(ct => ct.busNumber === task.vehiculoId);
        const completedForm = completedForms.find(cf => cf.busNumber === task.vehiculoId);
        
        if (completedByVehicle || completedForm) {
          return { ...task, estado: 'Completada' as const };
        }
      }
      
      // Para validadores, buscar por número de vehículo también
      if (task.taskType === 'validator') {
        const completedByVehicle = completedTasks.find(ct => ct.busNumber === task.vehiculo);
        if (completedByVehicle) {
          return { ...task, estado: 'Completada' as const };
        }
      }
      
      return task;
    });
  };

  // Función para marcar una tarea como completada
  const markTaskCompleted = (taskId: string, taskType: 'revision' | 'validator') => {
    const newCompletedTask: CompletedTask = {
      id: taskId,
      taskType,
      completedAt: new Date().toISOString(),
      status: 'Completada'
    };

    const updatedTasks = [...completedTasks];
    const existingIndex = updatedTasks.findIndex(task => task.id === taskId);
    
    if (existingIndex !== -1) {
      updatedTasks[existingIndex] = newCompletedTask;
    } else {
      updatedTasks.push(newCompletedTask);
    }

    setCompletedTasks(updatedTasks);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedTasks', JSON.stringify(updatedTasks));
    }
  };

  // Función para verificar si una tarea está completada
  const isTaskCompleted = (taskId: string): boolean => {
    return completedTasks.some(task => task.id === taskId);
  };

  // Función para verificar si una tarea está completada por vehículo
  const isTaskCompletedByVehicle = (vehicleNumber: string): boolean => {
    return completedTasks.some(task => task.busNumber === vehicleNumber) ||
           completedForms.some(form => form.busNumber === vehicleNumber);
  };

  // Función para obtener la fecha de completado de una tarea
  const getTaskCompletionDate = (taskId: string): string | null => {
    const task = completedTasks.find(task => task.id === taskId);
    return task ? task.completedAt : null;
  };

  // Función para limpiar todas las tareas completadas (útil para testing)
  const clearCompletedTasks = () => {
    setCompletedTasks([]);
    setCompletedForms([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('completedTasks');
      localStorage.removeItem('completedMaintenanceForms');
    }
  };

  // Función para obtener estadísticas offline
  const getOfflineStats = () => {
    const totalOfflineCompletions = completedTasks.length;
    const totalForms = completedForms.length;
    const today = new Date().toDateString();
    const todayCompletions = completedTasks.filter(task => 
      new Date(task.completedAt).toDateString() === today
    ).length;

    return {
      totalOfflineCompletions,
      totalForms,
      todayCompletions,
      lastSyncDate: null // Esto se implementaría con una sincronización real
    };
  };

  // Función para obtener datos de formulario por vehículo
  const getFormDataByVehicle = (vehicleNumber: string): CompletedForm | null => {
    return completedForms.find(form => form.busNumber === vehicleNumber) || null;
  };

  return {
    completedTasks,
    completedForms,
    isLoaded,
    mergeTasksWithOfflineStatus,
    markTaskCompleted,
    isTaskCompleted,
    isTaskCompletedByVehicle,
    getTaskCompletionDate,
    clearCompletedTasks,
    getOfflineStats,
    getFormDataByVehicle
  };
};