export class ErrorValidacion extends Error {
  constructor(readonly errores: { campo: string; motivo: string }[]) {
    super('Filtro inválido');
    this.name = 'ErrorValidacion';
  }
}
export class ServicioNoDisponibleError extends Error {
  constructor() {
    super('Base de datos y API externa no respondieron');
    this.name = 'ServicioNoDisponibleError';
  }
}
export class ErrorRepositorio extends Error {
  constructor(mensaje: string, readonly causaOriginal?: unknown) {
    super(mensaje);
    this.name = 'ErrorRepositorio';
  }
}
export type CausaFalloExterno = 'TIMEOUT' | 'RED' | 'HTTP' | 'LIMITE_CUOTA' | 'ESQUEMA' | 'EN_PAUSA';
export class ErrorProveedorExterno extends Error {
  constructor(readonly fallos: { proveedor: 'DATOSGOV' | 'APICOL'; causa: CausaFalloExterno }[]) {
    super('Fallaron los proveedores externos');
    this.name = 'ErrorProveedorExterno';
  }
}
export class ErrorEventoInvalido extends Error {
  constructor(readonly campo: string, readonly motivo: string) {
    super(`${campo}: ${motivo}`);
    this.name = 'ErrorEventoInvalido';
  }
}
