export const Testimonial = ({
  date,
  handle,
  name,
  testimonial,
}: {
  name: string;
  handle: string;
  testimonial: string;
  date: string;
}) => {
  return (
    <div className="h-fit w-full p-3">
      <div className="rounded-4xl h-full rounded-lg border bg-neutral-800 bg-opacity-60 p-6">
        <div className="flex h-full flex-col justify-between">
          <div className="mb-5 block">
            <div className="-m-2 mb-4 flex flex-wrap">
              <div className="w-auto p-2">
                {/* <Image src="flaro-assets/images/testimonials/avatar.png" alt=""> */}
              </div>
              <div className="w-auto p-2">
                <h3 className="font-semibold leading-normal">{name}</h3>
                <p className="uppercase text-neutral-500">{handle} </p>
              </div>
            </div>
            <p className="text-lg font-medium">{testimonial}</p>
          </div>
          <div className="block">
            <p className="text-sm font-medium text-neutral-500">{date} </p>
          </div>
        </div>
      </div>
    </div>
  );
};
