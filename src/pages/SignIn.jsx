import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/slices/authSlice"; // replace with the path to your authSlice file
import { useEffect } from "react";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(login({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold uppercase">PrimeSys</h1>
      <p className="text-2xl font-medium">Log in into your account</p>
      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email", { required: true })}
            type="text"
            placeholder="Email Address"
            className="input input-ghost bg-slate-200"
            disabled={isLoading}
          />
          {errors.email && <span>Email is required</span>}
          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="input input-ghost bg-slate-200"
            disabled={isLoading}
          />
          {errors.password && <span>Password is required</span>}
          <button
            type="submit"
            className="btn btn-primary col-span-4"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </form>
        {error && <p>{error}</p>}
      </div>

      {/* 
        <Link to="/forgot-password" className="link">
          Forgot your password?
        </Link>
      */}

      <p>
        Don't have an account?{" "}
        <Link to="/register" className="link">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
