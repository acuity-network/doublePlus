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
          console.log(level, width, height);
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




  // async createMixin () {

  // // Check for the various File API support.
    
  //       var rawImageData = jpeg.decode(this.filepath);
  //       var mipmaps = [];

        
  //       IpfsUtil.addFile(data)
  //       .then(hash => {return hash})
      

  //       var level = 1;
  //       do {
  //         var scale = Math.pow(2, level);
  //         var width = Math.floor(rawImageData.width / scale);
  //         var height = Math.floor(rawImageData.height / scale);
  //         console.log(level, width, height);
  //         mipmaps.push(scaleImage(rawImageData, width, height));
  //         level++;
  //       }
  //       while (width > 64 && height > 64);

  //       Promise.all(mipmaps).then(mipmaps => {
  //         var message = new jpegImageProto.JpegMipmap();
  //         message.setWidth(rawImageData.width);
  //         message.setHeight(rawImageData.height);
  //         mipmaps.forEach(mipmap => {
  //           message.addMipmaplevelfilesize(mipmap.Size);
  //           message.addMipmaplevelipfshash(Base58.decode(mipmap.Hash));
  //         });

  //         var mixinPayload = message.serializeBinary();

  //         var mixinMessage = new item.Mixin();
  //         mixinMessage.setMixinId(0);
  //         mixinMessage.setPayload(mixinPayload);

  //         var itemMessage = new item.Item();
  //         itemMessage.addMixins(mixinMessage);

  //         var itemPayload = itemMessage.serializeBinary();
  //         console.log(itemPayload.length);

  //         var output = bro.compressArray(itemPayload, 11);
  //         console.log(output.length);

	// 				var uploadFormData = new FormData();
	// 				uploadFormData.append("", new File([Buffer.from(output).toString('binary')], {type:"application/octet-stream"}));

	// 				return $.ajax({
	// 					url: "http://127.0.0.1:5001/api/v0/add",
	// 					method: "POST",
	// 					data: uploadFormData,
	// 					cache: false,
	// 					processData: false, // Don't process the files
	// 					contentType: false,
	// 					mimeType: "application/json",
	// 					dataType: "json"
	// 				})
	// 				.done(function(result) {
	// 					console.log(result.Hash);
	// 			    var decodedHash = multihash.decode(multihash.fromB58String(result.Hash));
	// 			    console.log(decodedHash);
				    
	// 			    if (decodedHash.name != "sha2-256") {
	// 			      throw "Wrong type of multihash.";
	// 			    }
				    
	// 			    var hashHex = "0x" + decodedHash.digest.toString("hex");
	// 			    console.log(hashHex);

	// 			    web3.eth.defaultAccount = web3.eth.accounts[4];
				    
	// 	        var flagsNonce = "0x00" + web3.sha3(Math.random().toString()).substr(4);
	// 			    var itemId = itemStore.getNewItemId(flagsNonce);
	// 			    console.log(itemId);
	// 			    itemStore.create(flagsNonce, hashHex, {gas: 1000000});
	// 				})
	// 				.fail(function(jqXHR, textStatus, errorThrown) {
	// 					console.log(textStatus);
	// 					console.log(errorThrown);
	// 				});

  //       });
      