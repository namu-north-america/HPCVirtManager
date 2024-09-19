import moment from "moment/moment";

const timeAgo = (date) => {
  return moment(date).fromNow();
};

export { timeAgo };
