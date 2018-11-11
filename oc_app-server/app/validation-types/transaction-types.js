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
      cc: number(),
      vc: number(),
      sc: number(),
      isExpected: boolean()
    })
  )
});

const searchDtoInType = shape({
  dateFrom: date().isRequired(),
  dateTo: date().isRequired()
});
