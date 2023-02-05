// import styles from "@/assets/styles/Home.module.css";
import { TagListSelector, useStore } from "@/stores";

export default function HomePage() {
  const tagList = useStore(TagListSelector);
  console.log(tagList);
  return (
    <div>
      {Object.keys(tagList).map((tag, i) => (
        <div key={i}>
          <div>{tag}</div>
          <div>
            {tagList[tag].map((item, _i) => (
              <div key={_i}>
                {Object.keys(item).map((method, _j) => {
                  const _k = method as keyof typeof item;
                  return <div key={_j}>{item[_k].summary}</div>;
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
