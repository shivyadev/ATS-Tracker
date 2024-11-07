interface Props {
  jobDescription: string;
}

export default function JobDescription({ jobDescription }: Props) {
  return (
    <div className="text-justify shadow-lg p-10 border-[1px] border-gray-200">
      {jobDescription}
    </div>
  );
}
