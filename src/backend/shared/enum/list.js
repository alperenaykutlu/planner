export const STATUS = {
  TODO:      'yapılacak',
  WAITING:   'beklemede',
  DONE:      'yapıldı',
  CANCELLED: 'iptal',
};

export const STATUS_LABEL = {
  [STATUS.TODO]:      'Yapılacak',
  [STATUS.WAITING]:   'Beklemede',
  [STATUS.DONE]:      'Yapıldı',
  [STATUS.CANCELLED]: 'İptal',
};

export const STATUS_COLOR = {
  [STATUS.TODO]:      '#3b82f6',
  [STATUS.WAITING]:   '#f59e0b',
  [STATUS.DONE]:      '#22c55e',
  [STATUS.CANCELLED]: '#6b7280',
};

// Görev modeli (JSDoc — tip güvenliği için)
/**
 * @typedef {Object} Task
 * @property {string}      id
 * @property {string}      title
 * @property {string}      [description]
 * @property {string}      status         - STATUS sabitlerinden biri
 * @property {string}      [dueDate]      - ISO string (tarih+saat)
 * @property {number}      [remindBefore] - kaç dakika önce (0 = tam saatinde)
 * @property {boolean}     reminded       - bildirim gönderildi mi
 * @property {string}      createdAt      - ISO string
 */