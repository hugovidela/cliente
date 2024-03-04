/* eslint-disable */
function redondear(imp, dec, cttdec) {
  cttdec = cttdec||2
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1,';
  let signo = imp >= 0?1:-1;
  let red = Math.round((imp * Math.pow(10, dec)) + (signo * .0001)) / Math.pow(10, dec).toFixed(dec).toString();
  //red = red.padStart(dec,"000000")
  let arr = red.toString().split('.');
  arr[0] = arr[0].replace(exp,rep);
  if (arr.length==1) {
    arr.push('00')
  } else if (arr[1].length<cttdec) {
    arr[1]+='0000'
    arr[1] = arr[1].substring(0,cttdec)
    //arr[1].padEnd(cttdec+arr[1].length,'0')
  }
  return arr[1] ? arr.join('.'): arr[0];
  //const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  //let signo = imp >= 0?1:-1;
  //let red = Math.round((imp * Math.pow(10, dec)) + (signo * .0001)) / Math.pow(10, dec).toFixed(dec).toString();
  //let val = (red/1).toFixed(dec).replace('.', ',');
  //let ult = val.toString().replace(exp, "."); 
  //return ult
  //return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  //return Math.round((imp * Math.pow(10, dec)) + (signo * .0001)) / Math.pow(10, dec).toFixed(dec).toString();
}

function cpr(cpr) {
  if (cpr==null) {
    return ''
  } else {
    if (cpr.substring(0,3)=='PED') {
      return cpr!=null?cpr.substring(4,20):''
    } else {
      return cpr!=null?cpr.substring(0,1)+cpr.substring(2,3)+cpr.substring(4,5)+' '+cpr.substring(7,10)+'-'+cpr.substring(13,20):''
    }
  }
}

export default {
  redondear, cpr
};
