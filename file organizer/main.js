let intputArray=process.argv.slice(2);
let fs=require("fs");
let path=require("path");
let command=intputArray[0];

let types ={
    media: ['mp4','mkv'],
    archives: ['zip','7z','rar','tar','gz','ar','iso','xz','pdf'],
    documents: ['docx','doc','pdf','xlsx','xls','odt','ods','odp','odg','odf',"txt",'ps','tex','docx','ppt'],
    app: ['exe','dmg','pkg','deb','js']
}

switch(command)
{
    case "tree":
        treeFn(intputArray[1])
        break;
        case "organize":
            organizeFn(intputArray[1])
            break;
        case "help":
            helpFn(intputArray[1])
            break;
            default:
                console.log("❗❗❗Please input a valid command ❗❗❗");
}



function treeFn(dirPath)
{

    if(dirPath==undefined)
    {
        console.log("❌❌ Kindly enter a valid path ❌❌❌");
    } 
                            // 2. create -> organized_files -> directory
    else { 
    let doesExist=fs.existsSync(dirPath);
    if(doesExist)
    {                       
 treeHelper(dirPath,"");
    }
    else{
     console.log("❌❌❌ Kindly enter a valid path ❌❌❌");
     return;
    }
    }

    console.log("Tree command implemented for ",dirPath);
}
function organizeFn(dirPath)
{

   // 1. input -> directory path given 
   if(dirPath==undefined)
   {
       console.log("❌❌ Kindly enter a valid path ❌❌❌");
   } 
                           // 2. create -> organized_files -> directory
   else { 
   let doesExist=fs.existsSync(dirPath);
   if(doesExist)
   {                       // if given path is valid
let destPath = path.join(dirPath,"organi_files");

if(!fs.existsSync(destPath))
{
fs.mkdirSync(destPath);
}
organizeHelper(dirPath,destPath);
   }
   else{
    console.log("❌❌❌ Kindly enter a valid path ❌❌❌");
    return;
   }
   }
}
function helpFn(dirPath)
{
    console.log(`
l ist of all the commands :
node main.js tree "directoryPath"
node main.js organise "directoryPath"
node main.js help
    `,dirPath);
}

function organizeHelper(src,dest)
{
    let childNames= fs.readdirSync(src);
    for(let i=0;i<childNames.length;i++)
    {
        let childAddress = path.join(src,childNames[i]);
      let isFile=  fs.lstatSync(childAddress).isFile();
      if(isFile)
      {
          let category=getCategory(childNames[i]);
sendFiles(childAddress,dest,category);
      }
    }
}

function getCategory(childName)
{
   let ext=path.extname(childName);
   ext=ext.slice(1);
   for(let type in types)
   {
       let cTypeArray=types[type];
       for(let i=0;i<cTypeArray.length;i++)
       {
           if(ext===cTypeArray[i])
           {
               return type;
           }
       }
   }
   return "others";
}

function sendFiles(srcFile,dest,category)
{
    let categoryPath=path.join(dest,category);
    if(!fs.existsSync(categoryPath))
    {
fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFile);
    let destFilePath=path.join(categoryPath,fileName);
    fs.copyFileSync(srcFile,destFilePath);
    fs.unlinkSync(srcFile);
}

function treeHelper(dirPath,indent)
{
   let isFile= fs.lstatSync(dirPath).isFile();
   if(isFile)
   {
let fileName=path.basename(dirPath);
console.log(indent+"|--"+fileName);
   }
   else{
       let dirName=path.basename(dirPath);
console.log(indent+"|__"+dirName);
let childrens=fs.readdirSync(dirPath);
for(let i=0;i<childrens.length;i++)
{
    let childPath=path.join(dirPath,childrens[i]);
    treeHelper(childPath,indent+"\t");
}
   }
}