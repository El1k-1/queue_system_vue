const servises = [
  { name: 'other', title: 'Другое' },
  { name: 'work', title: 'Трудоустройство, безработица' },
  { name: 'benefits', title: 'Пособия' },
  { name: 'pension', title: 'Пенсии' },
  { name: 'payments', title: 'Социальные выплаты' },
  { name: 'homeCare', title: 'Уход на дому' },
  { name: 'elderlySupport', title: 'Поддержка пожилых' },
  { name: 'disabilityAid', title: 'Помощь инвалидам' },
  { name: 'housing', title: 'Жилищные вопросы' },
  { name: 'childSupport', title: 'Поддержка семей с детьми' },
  { name: 'legalHelp', title: 'Юридическая помощь' },
  { name: 'consultation', title: 'Консультации' },
  { name: 'transportBenefit', title: 'Транспортные льготы' },
  { name: 'documents', title: 'Получение справок и документов' },
  { name: 'crisisSupport', title: 'Экстренная помощь' },
  { name: 'daycare', title: 'Устройство в детские учреждения' },
  { name: 'socialCard', title: 'Социальная карта' },
  { name: 'utilityDiscount', title: 'Коммунальные льготы' }
]
const queryStatuses = {
  'В ожидании': { icon: 'mdi-clock', color: 'warning' },
  'В работе': { icon: 'mdi-account', color: 'success' },
  Отклонен: { icon: 'mdi-cancel', color: 'error' },
  Завершено: { icon: 'mdi-account-check ', color: 'secondary' }
}
export {
  servises,
  queryStatuses
}
