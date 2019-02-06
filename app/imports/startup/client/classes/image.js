const pica1 = require('pica')
import jpegImageProto from '../lib/protobuf/jpeg-image_pb.js'
const Base58 = require("base-58");
const jpeg = require('jpeg-js');
const pica = new pica1();

//const fs = require('file-system');

// export default class Image {

//   constructor(filepath) {
//     this.filepath = filepath
//   }

//   async createMixin () {
//     // Use SIMD instructions if available.
//     sharp.simd(true)
//     var source = sharp(this.filepath)
//     .rotate()             // Rotate/flip the image if specified in EXIF.
//     .ignoreAspectRatio()  // Ensure that our predictable dimensions algorithm is used.

//     return source.metadata()
//     .then(metadata => {
//       // Work out correct dimensions if rotation occured.
//       var width, height
//       if (metadata.orientation > 4) {
//         width = metadata.height
//         height = metadata.width
//       }
//       else {
//         width = metadata.width
//         height = metadata.height
//       }
//       var mipmaps = []
//       // Don't resize the top-level mipmap.
//       mipmaps.push(source
//         .clone()
//         .webp()
//         .toBuffer()
//         .then(async (data) => {
//           return await IpfsUtil.addFile(data);
//         })
//       )

//       var level = 1
//       do {
//         var scale = Math.pow(2, level)
//         var outWidth = Math.round(width / scale)
//         var outHeight = Math.round(height / scale)
//         mipmaps.push(source
//           .clone()
//           .resize(outWidth, outHeight, {fastShrinkOnLoad: false})
//           .webp()
//           .toBuffer()
//           .then(async (data) => {
//             return await IpfsUtil.addFile(data);
//           })
//         )
//         level++
//       }
//       while (outWidth > 64 && outHeight > 64)

//       return Promise.all(mipmaps)
//       .then(mipmaps => {
//         var imageMessage = new jpegImageProto.JpegMipmap()
//         imageMessage.setWidth(metadata.width)
//         imageMessage.setHeight(metadata.height)
//         mipmaps.forEach(mipmap => {
//           var mipmapLevelMessage = new jpegImageProto.MipmapLevel()
//           mipmapLevelMessage.setFilesize(mipmap.data.Size)
//           mipmapLevelMessage.setIpfsHash(Base58.decode(mipmap.data.Hash))
//           imageMessage.addMipmapLevel(mipmapLevelMessage)
//         })

//         return imageMessage.serializeBinary()
//       })
//     })
//   }
// };



export default class Image {

  constructor(img) {
    this.img = img
  }

  async scaleImage(rawImageData, width, height) {
  
    let resizedImg = await pica.resizeBuffer({
      src: rawImageData.data, 
      width: rawImageData.width, 
      height: rawImageData.height,
      toWidth: width,
      toHeight: height
    });
    rawImageData = {
      data:resizedImg,
      width:width,
      height:height
    };

    let returnResizedImg = await jpeg.encode(rawImageData, 70);

    return Buffer.from(returnResizedImg.data);

  };

  async createMixin() {
    try{
        let rawImageData = await jpeg.decode(this.img);
        let mipmaps = [];
        // let imgInfuraPost = [];
        mipmaps.push(IpfsUtil.addFileReturnData(Buffer.from(this.img)));
        // imgInfuraPost.push(Buffer.from(this.img));

        var level = 1;
        do {
          var scale = Math.pow(2, level);
          var width = Math.floor(rawImageData.width / scale);
          var height = Math.floor(rawImageData.height / scale);
       
          let imgData = await this.scaleImage(rawImageData, width, height);
          mipmaps.push(IpfsUtil.addFileReturnData(imgData));
          // imgInfuraPost.push(imgData);
          level++;
        }
        while (width > 64 && height > 64);
        const imgMessage = new jpegImageProto.JpegMipmap()
        //IpfsUtil.addFiles(imgInfuraPost,true);
        await Promise.all(mipmaps).then(mipmaps => {
          imgMessage.setWidth(width)
          imgMessage.setHeight(height)
          mipmaps.forEach(mipmap => {
            //IpfsUtil.pinHash(mipmap.hash, true);
            let mipmapLevelMessage = new jpegImageProto.MipmapLevel()
            mipmapLevelMessage.setFilesize(mipmap.size)
            mipmapLevelMessage.setIpfsHash(Base58.decode(mipmap.hash))
            imgMessage.addMipmapLevel(mipmapLevelMessage)
          })
          let retMessage = imgMessage.serializeBinary();
          this.imgMessage = retMessage;
          return retMessage;
      });
    } catch(e) {
      console.log(e)
      return null;
    }
  };
}




  