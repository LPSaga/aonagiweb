

export const formatPrice = (value: number | string, abb = false) => {
    if (!value) return "$0.00";
    let unit = ''
    if (Number(value) > 1e6) {
      abb = true
    }
    let digit = 3
    if (Number(value) > 1e3) {
      digit = 0
    }
    if (Number(value) < 1) {
      digit = 4
    }
    if (Number(value) < 0.001) {
      digit = 8
    }
    if (Number(value) < 0.00000001) {
      digit = 10
    }
    if (Number(value) < 0.0000000001) {
      return '$0.0'
    }
    if (abb) {
      value = Number(value)
      if (value < 1000) { }
      else if (value < 1e6) {
        value = value / 1000
        unit = 'K'
      } else if (value < 1e9) {
        value = value / 1e6
        unit = 'M'
      } else if (value < 1e12) {
        value = value / 1e9
        unit = 'B'
      }
    }
    const str = Number(value).toFixed(digit).toString();
    let integer = str;
    let fraction = "";
    if (str.includes(".")) {
      integer = str.split(".")[0];
      fraction = "." + str.split(".")[1];
    }
    return "$" + integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction + unit;
  };
  
  export const formatAmount = function (value: number | string | undefined) {
    if (!value) return "0.00";
    let unit = ''
    let digit = 3
    const nm = Number(value)
    if (nm < 1) {
      digit = 4
    }
    if (nm < 0.0001) {
      digit = 6
    }
    if (nm < 0.000001) {
      digit = 8
    }
    if (nm < 0.00000001) {
      return '0.00'
    }
    if (nm > 1000) {
      digit = 2
    }
  
    if (Number.isInteger(nm)) {
      digit = 0
      if (nm > 1000) {
        digit = 2
      }
    }
    value = Number(value)
    if (value < 1e6) {
    } else if (value < 1e9) {
      value = value / 1e6
      unit = 'M'
    } else if (value < 1e12) {
      value = value / 1e9
      unit = 'B'
    } else if (value < 1e18) {
      value = value / 1e12
      unit = 'T'
    } else {
      value = value.toString()
      if (value.indexOf('e') !== -1) {
        const [number, type] = value.split('e')
        return `${parseFloat(number).toFixed(2)}e${type.replace('+', '')}`
      } else {
        value = Number(value)
      }
    }
    const str = value.toFixed(digit).toString();
    let integer = str;
    let fraction = "";
    if (str.includes(".")) {
      integer = str.split(".")[0];
      fraction = "." + str.split(".")[1];
    }
    return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fraction + unit;
  }
  
  export function formatAddress(val: string, start = 6, end = 6) {
    if (!val || val === '' || val.length < 12) return val
    return `${val.substring(0, start)}...${val.substring(val.length - end)}`
  }