// @ts-nocheck

//Generic filter
export const buildFilters = (filters , options = {}) => {

    const { numericFields = [], booleanFields = []} = options;

    const conditions = Object.entries(filters)

    .filter(([__, value]) => value !== undefined && value !== "")
    
    .map(([key, value]) => {

        if (numericFields.includes(key)) {
            return { [key]: { equals: Number(value) } };
        
        } else if (booleanFields.includes(key)) {
            return { [key]: { equals: value === 'true' } };
        
        } else {
            return { [key]: { contains: value, mode: 'insensitive' } };
        
        }

    
    })
    return conditions.length ? { AND: conditions } : {};
};