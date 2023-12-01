import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// props are pages, page, isAdmin
//pages = total pagenumber, page = current page, isAdmin = used to dispaly pagination in
//admin screen
const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1} // it increase x value
              to={
                // if it not admin user
                !isAdmin ? keyword ? `/search/${keyword}/page/${x+1}`
                  : `/page/${x + 1}` //then route to 'page/2 and so on...'
                  : //else, if it is admin,then route admin/productlist screen
                    `/admin/productlist/${x + 1}`
              }
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
