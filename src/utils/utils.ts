export const isNullOrUndefined = (value: any) => {
    return value === undefined || value === null
}


export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }