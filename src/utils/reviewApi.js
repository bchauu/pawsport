import axios from 'axios';

const getReviewApi = async ({apiUrl, setReviews, placeId}) => {
  console.log(apiUrl, placeId, setReviews, 'gerReviewApi');
  const response = await axios.post(
    `${apiUrl}/curatedgraphql`,
    {
      query: `
                              query {
                                  getPlaceReviews(placeId: "${placeId}") {
                                      reviews
                                          {
                                              author
                                              rating
                                              text
                                              relativeTimeDescription
                                          }
                                  }
                              }
                          `,
    },
    // {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // },
  );

  console.log(
    response.data.data.getPlaceReviews.reviews,
    'response.data.data.getPlaceReviews.reviews',
  );

  return response.data.data.getPlaceReviews.reviews;
};

export default getReviewApi;
