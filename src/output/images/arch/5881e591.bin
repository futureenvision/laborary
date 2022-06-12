#!/usr/bin/bash
echo "Re-generate initial ramdisk environment"
mkinitcpio -p linux

# uncomment to remove signing if you are unable to resolve signing errors otherwise
sed -i 's/SigLevel.*/SigLevel = Never/g' /etc/pacman.conf

pacman -S --noconfirm syslinux gptfdisk
syslinux-install_update -i -a -m

# disabling ldconfig to speed up boot (to remove Rebuild dynamic linker cache...)
# you may want to comment this out
echo "Disabling ldconfig service"
systemctl mask ldconfig.service

sync
