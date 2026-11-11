import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { errorMessage } from "@/api/client";
import { useAuth } from "@/auth/useAuth";
import ieeeIcon from "@/assets/icons/ieee_icon.svg";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/hackathon/ui/Alert";
import { Button } from "@/components/hackathon/ui/Button";
import { Card } from "@/components/hackathon/ui/Card";
import { Checkbox, Field, Input } from "@/components/hackathon/ui/form";
import { focusRing } from "@/components/hackathon/ui/styles";

type CapsLockEvent = React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLInputElement>;

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const { accessToken } = await authApi.login(username, password);
      login(accessToken, rememberMe);

      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from ?? "/admin", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Invalid username or password"));
    } finally {
      setIsLoading(false);
    }
  };

  const checkCapsLock = (e: CapsLockEvent) => setCapsLockActive(e.getModifierState("CapsLock"));

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <main className="hk-root relative isolate grid min-h-screen place-items-center overflow-hidden bg-black px-6 py-16">
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 -z-10" />

      <div className="w-full max-w-sm animate-page-in motion-reduce:animate-none">
        <Link to="/" aria-label="NU IEEE home" className={cn("mx-auto flex w-fit items-center gap-3 rounded-lg", focusRing)}>
          <img src={ieeeIcon} alt="" width={54} height={55} className="h-10 w-auto" />
          <span className="text-base font-semibold text-white">NU IEEE</span>
        </Link>

        <Card className="mt-8">
          <h1 className="text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-1 text-sm text-zinc-400">For NU IEEE board members.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Field label="Username">
              {(control) => (
                <Input
                  {...control}
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={handleUsernameChange}
                  onKeyUp={checkCapsLock}
                  onClick={checkCapsLock}
                  required
                  disabled={isLoading}
                />
              )}
            </Field>

            <Field label="Password" hint={capsLockActive && <span className="text-amber-300">Caps Lock is on</span>}>
              {(control) => (
                <Input
                  {...control}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyUp={checkCapsLock}
                  onClick={checkCapsLock}
                  required
                  disabled={isLoading}
                />
              )}
            </Field>

            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />

            {error && <Alert tone="error">{error}</Alert>}

            <Button type="submit" size="lg" loading={isLoading} className="w-full">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
