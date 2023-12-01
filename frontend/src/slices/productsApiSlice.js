import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // this will all products from backend
    // getProducts: builder.query({
    //   query: () => ({
    //     url: PRODUCT_URL,
    //   }),
    //   ProvidesTags:['Product'],
    //   keepUnusedDataFor: 5,

    // we want to display pagination
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCT_URL,
        params:{
          keyword,
          pageNumber,
        }
      }),
      ProvidesTags:['Product'],
      keepUnusedDataFor: 5,
    }),
 

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query : (data) => ({
        url: `${PRODUCT_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'], 
    }),

    uploadProductImage: builder.mutation({
      query : (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query:(productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'DELETE',
      })
    }),

    createReview: builder.mutation({
    query:(data) => ({
      url: `${PRODUCT_URL}/${data.productId}/reviews`,
      method: 'POST',
      body: data,
    }),
    invalidatesTags:['Products']
   }),

   getTopProducts: builder.query({
    query: () => ({
      url: `${PRODUCT_URL}/top`,
    }),
    keepUnusedDataFor:5
   })


  })
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery
} = productsApiSlice;
