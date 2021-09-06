"use strict";
const { abs, exp } = Math;
const getValueOfPercent = (whole, percent) => (whole / 100) * percent;
const getRatio = (a, A, b) => A * b / a;
const getPercentOfValue = (whole, part) => getRatio(whole, 100, part);
const isU = _ => _ === undefined;
const type = _ => typeof _;
const str = _ => String(_);
const int = _ => parseInt(_);

const eqArr = (arr1, arr2) => {
  if (type(arr1) != "object" || type(arr2) != "object") return false;
  if (!arr1.length || !arr2.length) return false;
  if (arr1.length != arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) if (arr1[i] != arr2[i]) return false;
  return true;
}
const s = _ => JSON.stringify(_);
const p = _ => JSON.parse(_);
const co = _ => p(s(_));

const isExist = (arg, boolCheck = false, stringCheck = false) => {
  let conditions = [
    arg === undefined,
    arg === null,
    Number.isNaN(arg),
  ];
  if(boolCheck === true) conditions.push(arg === false);
  if(stringCheck === true) conditions.push(arg === '');
  return !conditions.some(item => item === true);
};

const isString = val => {
  if (!isExist(val)) return false;
  if (type(val) !== 'string') return false;
  if (Object.getPrototypeOf(val).constructor.name !== 'String') return false;
  return true;
};
const isNumber = val => {
  if (!isExist(val)) return false;
  if (type(val) !== 'number') return false;
  if (Object.getPrototypeOf(val).constructor.name !== 'Number') return false;
  return true;
};
const isArray = array => {
  if (!isExist(array)) return false;
  if (type(array) !== 'object') return false;
  if (Object.getPrototypeOf(array).constructor.name !== 'Array') return false;
  return true;
};

const isObject = val => {
  if (!isExist(val)) return false;
  if (type(val) !== 'object') return false;
  if (isArray(val)) return false;
  return true;
};

const len = _ => {
  if (isNumber(_)) return String(_).length;
  if (isString(_)) return _.length;
  if (isArray(_)) return _.length;
  if (!isArray(_) && isObject(_)) return Object.keys(_).length;
  return -1;
};

const flat = arr => {
  let newArr = [];
  for (let a = 0; a < len(arr); a++) {
    newArr.push(arr[a].map(item => int(item)));
  }
  return co(newArr);
}

const insert = (child, root = document.body) => {
  if (!child) return false;
  root.appendChild(child);
};

const element = (type, params = {}) => {
  const {
    id,
    class: cls = null,
    style,
    text,
    title,
    event,
    events,
    href,
    src,
    alt,
  } = params;

  const newElement = document.createElement(type);
  if (id) newElement.setAttribute('id', id);
  if (cls) newElement.setAttribute('class', cls);
  if (style) newElement.setAttribute('style', style);
  if (text) newElement.innerText = text;
  if (title) newElement.title = title;
  if (event) newElement.addEventListener(event.type, e => { event.handler({ element: newElement, event: e }); });
  if (events) events.forEach(item => {
    newElement.addEventListener(item.type, e => {
      item.handler({ element: newElement, event: e });
    });
  });
  if (type === 'a' && href) newElement.setAttribute('href', href);
  if (type === 'a' && target) newElement.setAttribute('target', target);
  if ((type === 'img' || type === 'script') && src) newElement.setAttribute('src', src);
  if (type === 'img' && alt) newElement.setAttribute('src', alt);
  return newElement;
};



const isNode = o => (
  typeof Node === 'object' ? o instanceof Node
  : o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
);

const clss = ({
  element, has, add, remove,
}) => {
  const cnts = (e, c) => e.classList.contains(c);
  const dd = (e, c) => e.classList.add(c);
  const rem = (e, c) => e.classList.remove(c);
  if (!element && !isNode(element)) return false;
  if (has) return cnts(element, has);
  if (add && !cnts(element, add)) dd(element, add);
  if (remove && cnts(element, remove)) rem(element, remove);
};

const getAttr = (el, keyAttribute) => {
  if (!isNode(el)) return false;
  return el.getAttribute(keyAttribute);
};

const addAttr = (el, keyAttribute, valAttribute) => {
  if (!isNode(el)) return false;
  el.setAttribute(keyAttribute, valAttribute);
};

const setAttr = addAttr;

const delAttr = (el, keyAttribute) => {
  if (!isNode(el)) return false;
  el.removeAttribute(keyAttribute);
};

const remAttr = delAttr;

const domReady = fn => {
  let isRun = false;
  document.addEventListener('DOMContentLoaded', () => {
    if (!isRun) {
      isRun = true;
      fn();
    }
  });
  if (!isRun && (document.readyState === 'interactive' || document.readyState === 'complete')) {
    isRun = true;
    fn();
  }
};

const cssDoubleKill = cssString => {
  const getStyleRule = str => {
    const [rule, value] = str.split(':').map(item => item.trim());
    return {rule, value};
  };

  const parseStyleObjectToString  = o => Object
  .entries(o)
  .reduce((acc, [key, value]) => `${acc}${key}: ${value}; `, '')
  .trim();

  const styles = cssString.split(';')
  .filter(item => !!item.trim());

  const object = styles.reduce((acc, cur) => {
    const {rule, value} = getStyleRule(cur);
    return {...acc, [rule]: value}
  }, {});

  return parseStyleObjectToString(object);
};

const stl = (el, cssObj) => {
  let oldStyle = false;
  if (el.hasAttribute('style')) {
    oldStyle = getAttr(el, 'style');
    oldStyle += ' ';
  }
  let style = oldStyle || '';
  for (let val in cssObj) {
    if (cssObj.hasOwnProperty(val)) {
      style += str(val) + ': ' + str(cssObj[val]) + '; ';
    }
  }
  style = cssDoubleKill(style);
  setAttr(el, 'style', style);
};
const floor = _ => Math.floor(_);
const random = _ => Math.random();
const rndCoinInt = () => ~~floor(random() * 2);
const rndMinMax = (min, max) => random() * (max - min) + min;
const rndMinMaxInt = (min, max) => floor(random() * (max - min + 1)) + min;
const q = (selector, type = 'one', parent = document) => {
  if(!selector) return null;
  if (!isNode(parent)) return null;
  if(type === 'one') return parent.querySelector(selector);
  else if(type === 'all') return parent.querySelectorAll(selector);
  else if(type === 'id') return parent.getElementById(selector);
  else if(type === 'name') return parent.getElementsByName(selector);
  else if(type === 'tag') return parent.getElementsByTagName(selector);
  else if(type === 'class') return parent.getElementsByClassName(selector);
  return null;
};
const getPersentOfMax = (intValue, intMax) => {
  if (int(intValue) === 0 || int(intMax) === 0) return 0;
  return (int(intValue) * 100) / int(intMax);
};
const script = url => {
  if (isArray(url)) return Promise.all(url.map((item) => script(item)));
  return new Promise((resolve, reject) => {
    let r = false;
    console.log(url, '<<<');
    let s = element('script', {
      src: url,
      async: true
    });
    s.onload = s.onreadystatechange = function (a) {
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        resolve(this);
      }
    };
    s.onerror = s.onabort = function (a) {
      reject('error');
    }
    insert(s,  q('head'));
  });
};
