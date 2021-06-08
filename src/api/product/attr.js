import request from "@/utils/request";
export default {
  getAttrList({ category1Id, category2Id, category3Id }) {
    return request.get(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },
  removeAttr(attrId) {
    return request.delete(`/admin/product/deleteAttr/${attrId}`);
  },
  addOrUpdate(attr) {
    return request.post(`/admin/product/saveAttrInfo`, attr);
  }
};
