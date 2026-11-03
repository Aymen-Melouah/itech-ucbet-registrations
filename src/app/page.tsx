import Image from "next/image";
import AsciiBackground from "@/components/AsciiBackground";
import MembershipForm from "@/components/MembershipForm";

export default function Page() {
  return (
    <>
      <AsciiBackground />

      <main className="relative z-[1] mx-auto max-w-[700px] px-5 pb-[72px] pt-10">
        <header className="mb-[34px] flex items-center gap-[18px]">
          <Image src="/logo.png" alt="i-Tech logo" width={334} height={420} priority className="block h-auto w-[76px]" />
          <p className="m-0 text-[19px] font-medium leading-tight">
            i-Tech club
            <span className="block text-[15px] font-light text-dim">Chadli Bendjedid University, El Tarf</span>
          </p>
        </header>

        <h1 className="mb-3.5 text-[clamp(52px,12vw,104px)] font-bold leading-[.95] tracking-[-0.035em]">Join i-Tech</h1>
        <p className="mb-9 max-w-[44ch] text-[19px] font-light text-dim">
          Fill in the form below to apply for membership. It takes about three minutes.
        </p>

        <MembershipForm />
      </main>
    </>
  );
}
