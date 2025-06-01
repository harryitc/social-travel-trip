import sharp from "sharp";
import { encode } from "blurhash";
import * as fs from 'fs'
import { extname } from "path";

export function loadImage(path: any) {
  if (!path) {
    return path;
  }
  if (
    ['http://', 'https://', 'data:image'].every((x) => path.indexOf(x) == -1) ==
    true
  ) {
    return `${process.env.FILE_IMAGE_LINK}${path}`;
  }
  return path;
}

export enum ImageFit {
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
  INSIDE = 'inside',
  OUTSIDE = 'outside'
}
export enum ImageExt {
  WEBP = '.webp',
  JPEG = '.jpeg',
}


export async function scale(filePath, newPath, newName, width, ratio = 1) {
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }

  if (ratio != 1) {
    await sharp(filePath).metadata()
      .then(({ width }) => sharp(filePath)
        .resize({
          withoutEnlargement: true,
          width: Math.round(width * +ratio),
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .toFile(`${newPath}/${newName}`)
      );
    return;
  }

  await sharp(filePath)
    .resize({
      withoutEnlargement: true,
      width: width,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }).toFile(`${newPath}/${newName}`)
  return;
}

export function getResizeDirName(width, height) {
  return `${width}x${height}`;
}

export function getScaleDirName(width, ratio?) {
  if (ratio) {
    return `ratio${+ratio}`;
  }

  return `width${width}`;
}

export async function resize(filePath, newPath, newName, width, height, fit = ImageFit.COVER) {
  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }

  const fileExtName = extname(newName);
  switch (fileExtName) {
    // case '.png':
    //     await sharp(filePath).png({ palette: true }).resize(width, height).toFile(`${newPath}/${newName}`)
    //     break;

    default:
      await sharp(filePath).resize(width, height, {
        withoutEnlargement: true,
        fit: fit,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }).toFile(`${newPath}/${newName}`)
      break;
  }
  return;
}

export async function convertWebp(file, filePath, fileName) {
  const fileExtName = extname(fileName);
  await sharp(file).webp().toFile(`${filePath}/${fileName.replace(fileExtName, `${ImageExt.WEBP}`)}`)

  if (!fs.existsSync(`${filePath}/origin`)) {
    fs.mkdirSync(`${filePath}/origin`, { recursive: true });
  }

  // move file to origin folder
  fs.renameSync(`${filePath}/${fileName}`, `${filePath}/origin/${fileName}`)
  return;
}

export class IMAGE {
  public static readonly minWidth = 90;
  public static readonly minHeight = 120;
}

export async function getBlurHash(filePath) {
  let buf = await sharp(filePath).resize(IMAGE.minWidth, IMAGE.minHeight).ensureAlpha().raw().toBuffer()
  let hash = await encode(Uint8ClampedArray.from(buf), IMAGE.minWidth, IMAGE.minHeight, 4, 4)
  return hash
}