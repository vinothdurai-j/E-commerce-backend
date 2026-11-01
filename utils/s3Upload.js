const { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const crypto = require('crypto')
const s3 = require('../config/s3')

const BUCKET = () => process.env.AWS_S3_BUCKET
const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }
const MAX_SIZE = 5 * 1024 * 1024

const baseUrl = () => `https://${BUCKET()}.s3.${process.env.AWS_REGION}.amazonaws.com/`

// Presigned PUT URL (60 sec valid)
module.exports.createUploadUrl = async (contentType, folder = 'products') => {
    const key = `${folder}/${crypto.randomUUID()}.${EXT[contentType]}`

    const uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({
            Bucket: BUCKET(),
            Key: key,
            ContentType: contentType,
        }),
        { expiresIn: 60 }
    )

    return { uploadUrl, key, imageUrl: baseUrl() + key }
}

// S3-la nijamave upload aagirukka nu verify
module.exports.verifyUploaded = async (url, folder = 'products') => {
    if (!url.startsWith(baseUrl() + folder + '/')) return false
    const key = decodeURIComponent(url.slice(baseUrl().length))

    try {
        const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET(), Key: key }))
        return head.ContentLength <= MAX_SIZE
    } catch {
        return false
    }
}

module.exports.deleteFileByUrl = async (url) => {
    if (!url || !url.startsWith(baseUrl())) return
    const key = decodeURIComponent(url.slice(baseUrl().length))
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET(), Key: key }))
}