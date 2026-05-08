/* eslint-disable */
const importDtoInType = shape({
  data: array(
    shape({
      code: string().isRequired(),
      date: date().isRequired(),
      value: number().isRequired(),
      currency: string(/^[A-Z]{3}$/).isRequired(),
      account: string(),
      accountName: string(),
      details: string(),
      cc: string(),
      vc: string(),
      sc: string(),
      category: string()
    })
  )
});

const listDtoInType = shape({
  dateFrom: date().isRequired(),
  dateTo: date().isRequired(),
  category: string(),
  code: string()
});

const updateDtoInType = shape({
  id: id().isRequired(),
  code: string().isRequired(),
  date: date().isRequired(),
  value: number().isRequired(),
  currency: string(/^[A-Z]{3}$/).isRequired(),
  account: string(),
  accountName: string(),
  details: string(),
  cc: string(),
  vc: string(),
  sc: string(),
  category: string()
});
