<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - PRAND System</title>

    <style>
        body {
            opacity: 0;
            transition: opacity 0.2s ease-in;
        }

        body.loaded {
            opacity: 1;
        }

        svg {
            max-width: 1.5rem;
            max-height: 1.5rem;
            display: inline-block;
        }

        .icon-large svg {
            max-width: 2rem;
            max-height: 2rem;
        }

        .icon-small svg {
            max-width: 1.25rem;
            max-height: 1.25rem;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .glass-input {
            background: rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1.5px solid rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
        }

        .glass-input:focus {
            background: rgba(255, 255, 255, 0.7);
            border-color: rgba(99, 102, 241, 0.6);
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .gradient-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            background-size: 200% 200%;
            animation: gradientShift 3s ease infinite;
            position: relative;
            overflow: hidden;
        }

        .gradient-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
        }

        .gradient-btn:hover::before {
            left: 100%;
        }

        @keyframes gradientShift {
            0% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }

            100% {
                background-position: 0% 50%;
            }
        }

        .float-animation {
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        .alert-glow {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }

        .alert-glow-error {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        .toggle-password {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .toggle-password:hover {
            opacity: 0.7;
        }
    </style>

    @vite(['resources/js/app.jsx'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body class="relative min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image: url('/images/Municipal.jpg');">

    <div class="absolute inset-0 bg-gradient-to-br from-black/60 via-indigo-900/50 to-purple-900/60"></div>

    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full">

            <div class="glass-card rounded-3xl shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-24 h-24 overflow-hidden float-animation mb-4">
                        <img src="/images/logo-edited.png" alt="Culasi Logo" class="w-full h-full object-cover">
                    </div>
                    <p class="text-gray-700 text-sm font-medium">Cemetery Operations Management</p>
                    <p class="text-xs text-gray-600 mt-1">Municipal Cemetery of Culasi</p>
                </div>

                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800">Sign In</h2>
                    <p class="text-sm text-gray-600 mt-1">Enter your credentials to access the dashboard</p>
                </div>

                @if (session('status'))
                    <div class="mb-6 glass-input border-green-400 p-4 rounded-xl alert-glow">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="ml-3 text-sm font-medium text-green-800">{{ session('status') }}</p>
                        </div>
                    </div>
                @endif

                @if (session('message'))
                    <div class="mb-6 glass-input border-green-400 p-4 rounded-xl alert-glow">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="ml-3 text-sm font-medium text-green-800">{{ session('message') }}</p>
                        </div>
                    </div>
                @endif

                @if ($errors->any())
                    <div class="mb-6 glass-input border-red-400 p-4 rounded-xl alert-glow-error">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                @foreach ($errors->all() as $error)
                                    <p class="text-sm font-medium text-red-800">{{ $error }}</p>
                                @endforeach
                            </div>
                        </div>
                    </div>
                @endif

                <form method="POST" action="/login" class="space-y-5">
                    @csrf

                    <!-- Email Field -->
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none icon-small">
                                <svg class="h-5 w-5 text-indigo-500 group-focus-within:text-indigo-600 transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input type="email" id="email" name="email" value="{{ old('email') }}" required
                                autofocus
                                class="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl outline-none text-gray-800 font-medium placeholder-gray-500 @error('email') border-red-400 @enderror"
                                placeholder="admin@prand.com">
                        </div>
                    </div>

                    <!-- Password Field -->
                    <div>
                        <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none icon-small">
                                <svg class="h-5 w-5 text-indigo-500 group-focus-within:text-indigo-600 transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input type="password" id="password" name="password" required
                                class="glass-input w-full pl-12 pr-12 py-3.5 rounded-xl outline-none text-gray-800 font-medium placeholder-gray-500"
                                placeholder="••••••••••">
                            <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
                                <svg class="h-5 w-5 text-gray-500 toggle-password" fill="none" stroke="currentColor" viewBox="0 0 24 24" onclick="togglePassword('password', this)" style="min-width: 20px; min-height: 20px;">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <!-- Remember Me and Forgot Password -->
                    <div class="flex items-center justify-between pt-2">
                        <div class="flex items-center">
                            <input type="checkbox" id="remember" name="remember"
                                class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer">
                            <label for="remember" class="ml-2 text-sm text-gray-700 font-medium select-none cursor-pointer">
                                Remember me
                            </label>
                        </div>
                        <a href="{{ route('password.request') }}" 
                            class="text-sm text-indigo-600 hover:text-purple-600 font-semibold transition-colors hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit"
                        class="gradient-btn w-full text-white font-bold py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl mt-6">
                        <span class="relative flex items-center justify-center icon-small">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Sign In to Dashboard
                        </span>
                    </button>
                </form>
            </div>

            <!-- Footer -->
            <div class="text-center mt-8">
                <p class="text-sm text-white drop-shadow-lg font-medium">
                    Municipal Cemetery of Culasi, Antique
                </p>

                <p class="text-xs text-gray-200 mt-2 drop-shadow">
                    © 2025 PRAND System. All rights reserved.
                </p>
            </div>
        </div>
    </div>

    <script>
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
        });
        setTimeout(function() {
            if (!document.body.classList.contains('loaded')) {
                document.body.classList.add('loaded');
            }
        }, 300);

        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            const isPassword = input.type === 'password';
            
            input.type = isPassword ? 'text' : 'password';
            
            if (isPassword) {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                `;
            } else {
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                `;
            }
        }
    </script>

</body>

</html>