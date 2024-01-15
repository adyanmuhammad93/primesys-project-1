import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/slices/authSlice"; // replace with the path to your authSlice file

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(registerUser({ email: data.email, password: data.password })).then(
      () => {
        alert("User successfully created!");
        navigate("/");
      }
    );
  };

  return (
    <div className="grow flex flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold uppercase">PrimeSys</h1>
      <p className="text-2xl font-medium">Register your account</p>
      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register("email", { required: true })}
            type="email"
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
            {isLoading ? "Loading..." : "Register Now"}
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
        Already have an account?{" "}
        <Link to="/" className="link">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
