import { genWeekReport } from "./dist/esm/bundle.esm.js";
// genWeekReport().then(res=>{
//     console.log(res)
// })

// const {genWeekReport}  = require('./dist/cjs/bundle.cjs')
genWeekReport().then(res=>{
    console.log(res)
})