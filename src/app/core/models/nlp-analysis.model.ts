export interface NlpAnalysisModel {
  id?: number;
  declaration_id: number;  
  emocion_detectada: string;
  tendencia_emocional: string;
  impacto_en_rendimiento: string;
  impacto_en_equipo: string;
  estado_actual_emocional: string;
  rendimiento_predicho: string;
  resumen_general: string;
  acciones_recomendadas: string;
  created_at?: string;
}
