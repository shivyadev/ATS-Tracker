import SkillsList from "./SkillsList";

interface Props {
  matchedSkills: Record<string, string[]>;
  missingSkills: Record<string, string[]>;
}

export default function Skills({ matchedSkills, missingSkills }: Props) {
  return (
    <div className="mt-5">
      <SkillsList
        header={"Programming Languages"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="programming_languages"
      />
      <SkillsList
        header={"Frameworks"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="frameworks"
      />
      <SkillsList
        header={"Databases"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="databases"
      />
      <SkillsList
        header={"Soft Skills"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="soft_skills"
      />
      <SkillsList
        header={"Tools"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="tools"
      />
      <SkillsList
        header={"Certifications"}
        matchedSkills={matchedSkills}
        missingSkills={missingSkills}
        category="certifications"
      />
    </div>
  );
}
