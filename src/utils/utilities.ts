export const getPaginated = (data: any[], page: number, limit: number) => {
    return {
      PageIndex:  page ,
      PageSize:  limit ,
      ThisCount: data.length,
      PageResult: data,
    };
  };