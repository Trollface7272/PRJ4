export const imageFormats = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]

export const readFile = (file: File) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = () => {
            resolve((reader.result as string))
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export const calculateProgress = (level: number, xp: number) => {
    const nextLevel = 250 * (1.5 * (level + 1))
    const currentLevel = 250 * (1.5 * level)
    const requiredXp = nextLevel - currentLevel
    const currentXp = xp - currentLevel
    const progress = Math.round((currentXp / requiredXp) * 100)
    return progress
}