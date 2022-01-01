export enum ModalTypeEnum {
  success = 'SUCCESS',
  error = 'ERROR',
  game_end = 'GAME_END'
}

export interface ModalData {
  type: ModalTypeEnum;
  isAdmin: boolean;
}
