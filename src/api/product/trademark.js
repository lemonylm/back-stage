import request from "@/utils/request";

export default {
  delete(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },
  addOrUpdate(tradeInfo) {
    if (tradeInfo.id) {
      return request.put(`/admin/product/baseTrademark/update`);
    } else {
      return request.post(`/admin/product/baseTrademark/save`);
    }
  },
  getTrademarkList(page,limit) {
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  }
};
