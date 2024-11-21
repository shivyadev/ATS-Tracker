import { Check, X } from "lucide-react";

interface Props {
  searchAbility: Record<string, string[]>;
}

export default function Searchability({ searchAbility }: Props) {
  return (
    <div className="mt-2 p-2 pr-4">
      <div className="mt-2 flex justify-between">
        <span className="flex gap-2 items-center justify-center">
          <h2>Email </h2>
          {searchAbility["email"] !== undefined ? (
            <Check className="bg-green-500 rounded-full text-white size-3" />
          ) : (
            <X className="bg-red-500 rounded-full text-white size-3" />
          )}
        </span>
        <span className="">
          {searchAbility["email"] !== undefined ? searchAbility["email"] : ""}
        </span>
      </div>
      <div className="mt-2 flex justify-between gap-4">
        <span className="flex gap-2 items-center justify-center">
          <h2>Contact Details </h2>
          {searchAbility["phone"] !== undefined ? (
            <Check className="bg-green-500 rounded-full text-white size-3" />
          ) : (
            <X className="bg-red-500 rounded-full text-white size-3" />
          )}
        </span>
        <span className="">
          {searchAbility["phone"] !== undefined ? searchAbility["phone"] : ""}
        </span>
      </div>
      <div className="mt-2 flex flex-col items-start">
        <span className="flex gap-2 items-center justify-center">
          <h2>Social Media Handles </h2>
          {searchAbility["social_media_handles"].length !== 0 ? (
            <Check className="bg-green-500 rounded-full text-white size-3" />
          ) : (
            <X className="bg-red-500 rounded-full text-white size-3" />
          )}
        </span>
        <span>
          {searchAbility["social_media_handles"].map((item, key) => (
            <ul key={key}>
              <li>{item}</li>
            </ul>
          ))}
        </span>
      </div>
    </div>
  );
}
