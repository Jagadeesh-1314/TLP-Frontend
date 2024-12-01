import DonePage from '../../components/Animations/AnimationTemplate';

export default function CompletedFeedback() {
  return (
    <DonePage
      title="Feedback Submitted!"
      message="You have completed your feedback successfully."
      redirectPath="/sem"
    />
  );
}