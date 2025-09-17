import { SvgIcon } from "@/components/SvgIcon";
import { Divider } from "./Divider";

export const RelatedResources = () => {
  return (
    <section>
      {[].map((item, index, self) => {
        return (
          <div key={index}>
            <div className="flex gap-2 items-start">
            <SvgIcon icon="icon-keyanshiti" className="w-4 h-4 mt-1"/>
            <div className="flex gap-2 flex-col flex-1">
              <div className="text-[var(--kx-text-1)] font-semibold text-sm leading-[22px]"></div>
              <div className="text-[var(--kx-text-3)] text-xs">2020-10-29</div>
            </div>
            </div>
            {self.length - 1 !== index && <Divider />}
          </div>
        );
      })}
    </section>
  );
};