import parse from 'date-fns/parse'
import format from 'date-fns/format'

export const formatDate = (date) => {
    var result = parse(
      date,
      `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`,
      new Date()
    );
    return format(result, 'dd/MM/yyyy');
}

export const getYesterdayMidnight = () => {
    let yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
    yesterday.setHours(23);
    yesterday.setMinutes(59);
    yesterday.setSeconds(59);
    return yesterday;
}