export interface NlpAnalysisModel {
  id?: number;
  analysis_id: number;
  emocion_detectada: string; // "Felicidad", "Ansiedad", "Ira"
  tendencia_emocional: string; // Explicación de cómo han cambiado las emociones
  impacto_en_rendimiento: string; // "Positivo", "Negativo", "Neutro"
  impacto_en_equipo: string; // "Positivo", "Negativo", "Neutro"
  estado_actual_emocional: string; // "Estable", "Inestable", "En riesgo"
  rendimiento_predicho: string; // "Alto", "Medio", "Bajo"
  resumen_general: string; // Explicación global
  acciones_recomendadas: string; // Sugerencias de la IA
  created_at?: string;
}
