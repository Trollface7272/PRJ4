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