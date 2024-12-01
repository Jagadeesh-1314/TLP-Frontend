import DonePage from '../../components/Animations/AnimationTemplate';

export default function ThankYou() {
  return (
    <DonePage
      title="Thank you!"
      message="Your submission has been recorded successfully."
      redirectPath="/sem"
    />
  );
}