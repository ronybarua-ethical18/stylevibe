import React from 'react';
import FormInput from '../Forms/FormInput';
import Form from '../Forms/Form';

export default function SVNewsLetter() {
  const onSubmit = () => {
    console.log('the newsletter');
  };
  return (
    <div className="mt-20 py-16 bg-gray-200">
      <div className="w-3/4 m-auto flex justify-between items-center">
        <div className="w-full mr-20">
          <h1 className="text-3xl font-medium text-customPrimary-800">
            SUBSCRIBE OUR NEWSLETTER
          </h1>
          <h6 className="font-thin text-base">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet
          </h6>
        </div>
        <div className="w-full">
          <Form submitHandler={onSubmit}>
            <FormInput
              type="text"
              name="newsletter"
              placeholder="Your Email Address"
              variant="filled"
              style={{ height: '60px' }}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}
