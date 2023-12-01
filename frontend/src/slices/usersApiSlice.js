import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      //data will api/users/login path
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),

    //register builder, to create new user
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    //logout builder = sends request to server and removed data from server side
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    //profile builder = Updates the current user details
    profile: builder.mutation({
        query:(data) => ({
            url: `${USERS_URL}/profile`,
            method:'PUT',
            body: data,
        })
    }),

    //for admin = getUsers wch fetches all user details
    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET'
    }),
    ProvidesTags: ['User'],
    keepUnusedDataFor: 5
    }),

    deleteUser: builder.mutation({
      query:(userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE'
      }),
      ProvidesTags: ['User']
    }),

    getUserDetails:builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} = usersApiSlice;
