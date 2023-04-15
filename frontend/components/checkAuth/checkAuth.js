import { useRouter } from "next/router";
import { isAutheticated } from "../../api/authAPICalls";
import { useEffect } from "react";

const checkAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAutheticated()) {
        router.replace("/signin");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default checkAuth;
