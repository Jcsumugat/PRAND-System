<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Forgot Password - PRAND System</title>

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

                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                    <p class="text-sm text-gray-600 mt-2">No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>
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

                <form method="POST" action="{{ route('password.email') }}" class="space-y-5">
                    @csrf

                    <!-- Email Field -->
                    <div>
                        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div class="relative group">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none icon-small">
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

                    <!-- Submit Button -->
                    <button type="submit"
                        class="gradient-btn w-full text-white font-bold py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 transform hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl mt-6">
                        <span class="relative flex items-center justify-center icon-small">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email Password Reset Link
                        </span>
                    </button>
                </form>

                <!-- Back to Login Link -->
                <div class="mt-8 text-center">
                    <p class="text-sm text-gray-600">
                        Remember your password?
                        <a href="{{ route('login') }}"
                            class="font-bold text-indigo-600 hover:text-purple-600 transition-colors underline decoration-2 underline-offset-2">
                            Back to Sign In
                        </a>
                    </p>
                </div>
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
    </script>

</body>

</html>