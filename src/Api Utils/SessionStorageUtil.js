const get = (key) => {
    let value = sessionStorage.getItem(key);
    return JSON.parse(value);
}

const set = (key, obj) => {
    sessionStorage.setItem(key, JSON.stringify(obj));
}

export default { get, set }