
export const getNameForCategory = (categoryName: string) => {
    return categoryName.split("_").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
}