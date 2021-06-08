import request from '@/utils/request'
export default{
 getCategory1(){
     return request.get('/admin/product/getCategory1')
 },
 getCategory2(id){
     return request.get(`/admin/product/getCategory2/${id}`)
 },
 getCategory3(id){
     return request.get(`/admin/product/getCategory3/${id}`)
 },
}