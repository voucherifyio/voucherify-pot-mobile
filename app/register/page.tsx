export default function RegisterPage() {
  const inputStyle =
    'border-blue-inputOutlineDefault h-[44px] w-full rounded-md px-3 py-2 bg-blue-background';
  const labelStyle =
    'text-blue-formInput font-14 h-[16px] mb-2 block text-sm font-normal';
  return (
    <div className="h-screen items-center justify-center">
      <div className="border-bottom-gray-200 flex h-[25%] w-full flex-col items-center justify-center border-b bg-white">
        <h1 className="text-blue-text  text-xl font-extrabold">
          Create your account
        </h1>
        <h4 className="text-blue-text">to start earning rewards</h4>
      </div>
      <div className="bg-blue-background flex h-[75%] max-h-full w-full flex-col items-center justify-center">
        <form className="bg-blue-background mt-6 h-[100%] w-full rounded-md px-2 shadow-md">
          <div className="mb-6">
            <label htmlFor="firstName" className={labelStyle}>
              First name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              // value={formData.firstName}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="lastName" className={labelStyle}>
              Last name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              // value={formData.lastName}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phoneNumber" className={labelStyle}>
              Phone number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              // value={formData.phoneNumber}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className={labelStyle}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              // value={formData.email}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className={labelStyle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              // value={formData.password}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="repeatPassword" className={labelStyle}>
              Repeat Password
            </label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              // value={formData.repeatPassword}
              // onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-text mt-2 h-[44px] w-full rounded px-4 py-2 font-bold text-white"
            // onClick={handleSubmit}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
